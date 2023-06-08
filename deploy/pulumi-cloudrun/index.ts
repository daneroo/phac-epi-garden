import * as gcp from "@pulumi/gcp";
import * as pulumi from "@pulumi/pulumi";

// gcp stack related config
const gcpConfig = new pulumi.Config("gcp");
const projectId = gcpConfig.require("project");
const region = gcpConfig.require("region");

// our project specific related config
const epiConfig = new pulumi.Config("epi");
const managedZoneName = epiConfig.require("managedZoneName");
const managedZoneId = epiConfig.require("managedZoneId");

const serviceNames = ["epi-docs", "epi-t3"];

// Get the existing managed zone details.
// managedZoneId=`gcloud dns managed-zones describe $(pulumi config get gcp:baseDomain) --format=json | jq -r .id`
// pulumi config set gcp:managedZoneId "${managedZoneId}"
const existingManagedZone = gcp.dns.ManagedZone.get(
  managedZoneName,
  managedZoneId,
);

serviceNames.forEach((serviceName) => {
  // the domain name for the service, resolved by prepending the service-name
  // i.e. epi-docs.your.managed.domain
  const serviceDomainName = existingManagedZone.dnsName.apply((dnsName) => {
    // the ManagedZone.dnsName has a trailing "."
    let cleanDnsName = dnsName.replace(/\.$/, ""); // replace trailing "."
    return `${serviceName}.${cleanDnsName}`;
  });

  // Get the existing Cloud Run service details.
  let cloudRunService = gcp.cloudrun.getService({
    name: serviceName,
    location: region,
  });

  const certificate = new gcp.compute.ManagedSslCertificate(
    `${serviceName}-certificate`,
    {
      managed: {
        domains: [serviceDomainName],
      },
    },
  );

  // Create a Serverless Region Network Endpoint Group (NEG).
  const neg = new gcp.compute.RegionNetworkEndpointGroup(`${serviceName}-neg`, {
    region: region,
    networkEndpointType: "SERVERLESS",
    cloudRun: {
      service: serviceName,
    },
  });

  // Create a Load Balancer backend.
  const backend = new gcp.compute.BackendService(`${serviceName}-backend`, {
    portName: "http",
    protocol: "HTTP",
    connectionDrainingTimeoutSec: 300,
    backends: [
      {
        group: neg.selfLink,
      },
    ],
  });

  // Create a URL map.
  const urlMap = new gcp.compute.URLMap(`${serviceName}-url-map`, {
    defaultService: backend.selfLink,
  });

  // Create a target HTTPS proxy.
  const targetHttpsProxy = new gcp.compute.TargetHttpsProxy(
    `${serviceName}-https-proxy`,
    {
      urlMap: urlMap.selfLink,
      sslCertificates: [certificate.id],
    },
  );

  const forwardingRule = new gcp.compute.GlobalForwardingRule(
    `${serviceName}-forwarding-rule`,
    {
      target: targetHttpsProxy.selfLink,
      portRange: "443",
    },
  );

  // Create a DNS record.
  let dnsRecord = serviceDomainName.apply(
    (dnsName) =>
      new gcp.dns.RecordSet(`${serviceName}-dns-record`, {
        // domain, with a trailing "."
        name: `${dnsName}.`,
        managedZone: existingManagedZone.name,
        type: "A",
        ttl: 300,
        rrdatas: [forwardingRule.ipAddress],
      }),
  );

  exports[`${serviceName}-url`] = serviceDomainName.apply(
    (dnsName) => `https://${dnsName}`,
  );
});
