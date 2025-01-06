/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "sst-pocketbase",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          profile: "<enter_profile>",
          region: "eu-west-2",
        },
        gcp: {
          project: "<Enter gcp project id>",
        },
        docker: "4.5.8",
      },
    };
  },
  async run() {
    if ($app.stage === "gcp") {
      const gcp = await import("./infra/gcp");

      return {
        image_url: gcp.image.imageName,
        url: gcp.service.statuses[0].url,
        dashboard_url: $interpolate`${gcp.service.statuses[0].url}/_`,
      };
    }

    if ($app.stage === "aws") {
      const aws = await import("./infra/aws");
      return {
        url: aws.api.url
      }
    }

    throw new Error("Unrecognised stage name, must be `aws` or `gcp`")
  },
});
