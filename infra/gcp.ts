
const location = gcp.config.region || "europe-west2";

const imageName = "pocketbase-small"

export const image = new docker.Image(imageName, {
  imageName: $interpolate`gcr.io/${gcp.config.project}/${imageName}:latest`,
  build: {
    context: '../../',
    dockerfile: '../../Dockerfile',
    platform: "linux/amd64"
  },

})

export const volume = new gcp.storage.Bucket('volume', {
  location,
  name: "pb_volume"
})

export const service = new gcp.cloudrun.Service('pocketbase', {
  location,
  template: {
    metadata: {
      annotations: {
        "autoscaling.knative.dev/maxScale": "1",
        "autoscaling.knative.dev/minScale": "0",
      }
    },
    spec: {
      containers: [{
        image: image.imageName,
        resources: {
          limits: {
            memory: "1Gi",
            cpu: "1"
          },
          
        },
        ports: [{containerPort: 8080}],
        volumeMounts: [{
          name: "pb_data",  // This should match the volume name
          mountPath: "/pb/pb_data"  // This is where the volume will be mounted in your container
        }],
        livenessProbe: {
          httpGet: {
            path: "/api/health",
            port: 8080
          },
          initialDelaySeconds: 20,
          periodSeconds: 30,
          timeoutSeconds: 5,
          failureThreshold: 3
        }
      }],
      volumes:[{
        name: "pb_data",
        csi: {
          driver: "gcsfuse.run.googleapis.com",
          volumeAttributes: {            
            bucketName: volume.name
          }
        }
      }],
      containerConcurrency: 80
    }
  }
})


// Open the service to public unrestricted access
export const permissions = new gcp.cloudrun.IamMember("public_pb", {
  service: service.name,
  location,
  role: "roles/run.invoker",
  member: "allUsers",
});