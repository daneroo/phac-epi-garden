# Deploy to GCP using bash/cli (from Cloud Shell for example)

Deploy our two containers manually with `gcloud`

## Build containers locally

```bash
docker compose build

# yields
$ docker images | grep epi
phac-epi-garden-epi-docs                          latest            5b89c210c6df   5 minutes ago   201MB
phac-epi-garden-epi-t3                            latest            403e617fd108   2 days ago      224MB
```

## Create an artifact registry repository

```bash
# project name is phx-danl
export PROJECT_ID="pdcp-cloud-009-danl"
# Get the PROJECT_NUMBER from the PROJECT_ID
export PROJECT_NUMBER=$(gcloud projects describe ${PROJECT_ID} --format="value(projectNumber)")
export REGION="northamerica-northeast1"
export ARTIFACT_REGISTRY_REPO_NAME="epi-repo"

# Create an artifact registry repository
gcloud artifacts repositories create ${ARTIFACT_REGISTRY_REPO_NAME} \
   --repository-format=docker \
   --location=${REGION} \
   --description="${ARTIFACT_REGISTRY_REPO_NAME}"

# Allow our service account to read from the registry
gcloud artifacts repositories add-iam-policy-binding ${ARTIFACT_REGISTRY_REPO_NAME} \
  --location=${REGION} \
  --member=serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com \
  --role="roles/artifactregistry.reader"
```

## Creating a secret

This is to pass in environment variable that contain secrets, or to mount a secret as a file (like .env) into a container:

```bash
export PROJECT_ID="pdcp-cloud-009-danl"
# Get the PROJECT_NUMBER from the PROJECT_ID
export PROJECT_NUMBER=$(gcloud projects describe ${PROJECT_ID} --format="value(projectNumber)")
export REGION="northamerica-northeast1"

# Automatic - globally replicated is not allowed in our accounts
# gcloud secrets create epi-t3-env-secret --replication-policy="automatic"
gcloud secrets create epi-t3-env-secret --replication-policy="user-managed" --locations="${REGION}"

gcloud secrets versions add epi-t3-env-secret --data-file=".env.prod"

# alternative one secret per var
VARIABLES=(DATABASE_URL NEXTAUTH_URL NEXTAUTH_SECRET DISCORD_CLIENT_ID DISCORD_CLIENT_SECRET)  # replace with your variable names
for v in ${VARIABLES[@]}; do
# extract the secret from the production dotenv file
  SECRET=$(npx dotenv -e .env.prod -p $v)
  echo Setting variable $v to $SECRET
  # create if-not-exists
  if ! gcloud secrets describe "epi-t3-env-secret-$v" >/dev/null 2>&1; then
    gcloud secrets create "epi-t3-env-secret-$v" --replication-policy="user-managed" --locations="${REGION}"
  fi
  # # add/replace the secret
  echo -n "${SECRET}" | gcloud secrets versions add "epi-t3-env-secret-$v" --data-file=-
done

# show them
for v in ${VARIABLES[@]}; do
  echo "Latest value for $v is:"
  gcloud secrets versions access latest --secret="epi-t3-env-secret-$v"; echo
done

# Allow the service account to read the secrets
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member=serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com \
  --role=roles/secretmanager.secretAccessor

# list and show the secret
gcloud secrets list
gcloud secrets versions access latest --secret=epi-t3-env-secret
```

## Register Cloud Build Trigger

```bash
export PROJECT_ID="pdcp-cloud-009-danl"
export REGION="northamerica-northeast1"
export GITHUB_REPO_NAME="phac-epi-garden"
export GITHUB_REPO_OWNER="daneroo"

# list all existing triggers
gcloud builds triggers list --format="table(name, createTime)" --region ${REGION}

# Now, in a loop create a trigger for each of our services
for svc in epi-docs epi-t3; do
  gcloud builds triggers create github \
    --name=${GITHUB_REPO_NAME}-${svc} \
    --region ${REGION} \
    --repo-name=${GITHUB_REPO_NAME} \
    --repo-owner=${GITHUB_REPO_OWNER} \
    --include-logs-with-status \
    --branch-pattern="^main$" \
    --build-config=deploy/cloudbuild/cloudbuild-${svc}.yaml
done

# list all existing triggers - to see if the new triggers appeared, one for each service
gcloud builds triggers list --format="table(name, createTime)" --region ${REGION}

# describe : more details for each trigger
for svc in epi-docs epi-t3; do
  gcloud builds triggers describe --region ${REGION} ${GITHUB_REPO_NAME}-${svc}
done

# At this point you could push to the main branch of your github repo, and see the triggers fire

# If this was only a test, you can delete all the triggers with the following command
for svc in epi-docs epi-t3; do
  gcloud builds triggers delete --region ${REGION} ${GITHUB_REPO_NAME}-${svc}
done
```

## Deploy to Cloud Run

You don;t need to do this if you are using Cloud Build, this is an example of how to deploy manually with `gcloud`.

```bash
# so we can push from a local docker registry
gcloud auth login


# project name is phx-danl
export PROJECT_ID="pdcp-cloud-009-danl"
export REGION="northamerica-northeast1"
export ARTIFACT_REGISTRY_REPO_NAME="epi-repo"

gcloud config set project ${PROJECT_ID}
gcloud config set run/region ${REGION}

# Allow our docker client to read/write from the registry (for later)
gcloud auth configure-docker ${REGION}-docker.pkg.dev
# docker tag <LOCAL_IMAGE_NAME> gcr.io/<PROJECT_ID>/<IMAGE_NAME>

# e.g.: Pushes should be of the form docker push HOST-NAME/PROJECT-ID/REPOSITORY/IMAGE:TAG
docker tag phac-epi-garden-epi-docs:latest ${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REGISTRY_REPO_NAME}/epi-docs:latest
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REGISTRY_REPO_NAME}/epi-docs:latest
gcloud run deploy epi-docs --allow-unauthenticated --image ${REGION}-docker.pkg.dev/pdcp-cloud-009-danl/${ARTIFACT_REGISTRY_REPO_NAME}/epi-docs:latest


# Now, in a loop for each service; tag and push to the registry, then deploy to cloud run
for i in epi-docs; do
  # destination tag
  docker tag phac-epi-garden-$i:latest ${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REGISTRY_REPO_NAME}/$i:latest
  # push to registry
  docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REGISTRY_REPO_NAME}/$i:latest
  # deploy to cloud run
  gcloud run deploy $i --allow-unauthenticated --image ${REGION}-docker.pkg.dev/pdcp-cloud-009-danl/${ARTIFACT_REGISTRY_REPO_NAME}/$i:latest
done
```

## Create a Postgres Database

```bash
export PROJECT_ID="pdcp-cloud-009-danl"
export REGION="northamerica-northeast1"

# Create a random password and store in Secret Manager
export DB_PASSWORD=$(openssl rand -base64 16 | tr -dc A-Za-z0-9 | head -c16 ; echo '')
echo -n "${DB_PASSWORD}" | gcloud secrets create epi-db-password --replication-policy="user-managed" --locations="${REGION}" --data-file=-

# Create a VPC
gcloud compute networks create epi-vpc --subnet-mode=auto --bgp-routing-mode=regional

# Regional subnet
gcloud compute networks subnets create epi-subnet --network=epi-vpc --region=${REGION} --range=10.0.0.0/9

# Reserve an IP range for the service networking connection
gcloud compute addresses create google-managed-services-epi-vpc --global --purpose=VPC_PEERING --prefix-length=16 --network=epi-vpc

# Setup a connection with the service networking connection
gcloud services vpc-peerings connect --service=servicenetworking.googleapis.com --ranges=google-managed-services-epi-vpc --network=epi-vpc --project=${PROJECT_ID}

# Create a regional Cloud SQL instance with the generated password
gcloud sql instances create epi-instance --tier=db-f1-micro --region=${REGION} --root-password="${DB_PASSWORD}" --network=epi-vpc

# Create a Cloud SQL database in the instance
gcloud sql databases create epi-database --instance=epi-instance

# Create a database user with the generated password
gcloud sql users create epi-user --instance=epi-instance --password="${DB_PASSWORD}"

# Create a Secret in Secret Manager for the database connection string
echo -n "postgresql://epi-user:${DB_PASSWORD}@/epi-database?host=/cloudsql/${PROJECT_ID}:${REGION}:epi-instance" | gcloud secrets create epi-db-connection-string --replication-policy="user-managed" --locations="${REGION}" --data-file=-

# Deploy your Cloud Run service in the ${REGION} region
gcloud run deploy epi-service --image epi-container-image-url --add-cloudsql-instances epi-instance --update-secrets DATABASE_URL=epi-db-connection-string=latest --region ${REGION} --platform managed --allow-unauthenticated
```

### Cleanup

```bash
# Delete the Cloud Run service
gcloud run services delete epi-service --region ${REGION} --platform managed

# Delete the secret for the database connection string
gcloud secrets delete epi-db-connection-string

# Delete the Cloud SQL user
gcloud sql users delete epi-user --instance=epi-instance

# Delete the Cloud SQL database
gcloud sql databases delete epi-database --instance=epi-instance

# Delete the Cloud SQL instance
gcloud sql instances delete epi-instance

# Disconnect the service peering
gcloud services vpc-peerings disconnect --service=servicenetworking.googleapis.com --network=epi-vpc --project=${PROJECT_ID}

# Delete the IP range
gcloud compute addresses delete google-managed-services-epi-vpc --global

# Delete the subnet
gcloud compute networks subnets delete epi-subnet --region=${REGION}

# Delete the VPC
gcloud compute networks delete epi-vpc

# Delete the secret for the database password
gcloud secrets delete epi-db-password
```
