import * as gcp from "@pulumi/gcp";
import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config("gcp");
const projectId = config.require("project");
const region = config.require("region");

const serviceNames = ["epi-docs", "epi-t3"];

// Get the existing managed zone details.
// to get the id:
//  gcloud dns managed-zones describe dl-phac-alpha-canada-ca
const dlPhacAlphaExistingManagedZone = gcp.dns.ManagedZone.get(
  "dl-phac-alpha-canada-ca",
  "5975330339948395253",
);

serviceNames.forEach((serviceName) => {
  const domain = `${serviceName}.dl.phac.alpha.canada.ca`;

  // Get the existing Cloud Run service details.
  let cloudRunService = gcp.cloudrun.getService({
    name: serviceName,
    location: region,
  });

  const certificate = new gcp.compute.ManagedSslCertificate(
    `${serviceName}-certificate`,
    {
      managed: {
        domains: [domain],
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
  let dnsRecord = new gcp.dns.RecordSet(`${serviceName}-dns-record`, {
    // domain, with a trailing "."
    name: `${domain}.`,
    managedZone: dlPhacAlphaExistingManagedZone.name,
    type: "A",
    ttl: 300,
    rrdatas: [forwardingRule.ipAddress],
  });

  exports[`${serviceName}-url`] = `https://${domain}`;
});
