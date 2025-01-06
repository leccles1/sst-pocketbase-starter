const vpc = new sst.aws.Vpc("PBVpc");
const cluster = new sst.aws.Cluster("PBCluster", { vpc });
const efs = new sst.aws.Efs("PBEfs", { vpc });

export const service = cluster.addService("PBService", {
  serviceRegistry: {
    port: 8080,
  },
  cpu: "0.25 vCPU",
  memory: `1 GB`,
  image: {
    context: "server",
    dockerfile: "Dockerfile"
  },
  dev: {
    command: "go run ./cmd/main.go serve",
  },
  volumes: [
    {
      efs,
      path: "/pb/pb_data",
    },
  ],
});

export const api = new sst.aws.ApiGatewayV2("PBApi", {
  vpc,
});

if (!$dev) {
  api.routePrivate("$default", service.nodes.cloudmapService.arn);
}
