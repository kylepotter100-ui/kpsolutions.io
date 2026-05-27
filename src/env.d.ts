/// <reference types="astro/client" />

interface CloudflareEnv {
  RESEND_API_KEY: string;
}

type CfRuntime = import("@astrojs/cloudflare").Runtime<CloudflareEnv>;

declare namespace App {
  interface Locals extends CfRuntime {}
}
