export type SwaggerOption = {
  explorer: boolean
  swaggerOptions: SwaggerOptionOption
}
export type SwaggerOptionOption = {
  urls: SwaggerOptionOptionUrl[]
}
export type SwaggerOptionOptionUrl = {
  name: string
  url: string
}