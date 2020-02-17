module.exports = {
  server: 
    {
      service: {
        name: "aginun-server",
        url: "https://xr-volunteer-app.herokuapp.com/v1/graphql",
      },
      // Files processed by the extension
      includes: ["src/**/*.vue", "src/**/*.js", "src/**/*.gql"],
    },
   client:  {
      name: "aginun-clientside",
      localSchemaFile: "./src/gql/typedefs.gql",
      clientOnlyDirectives: ["connection", "type"],
      clientSchemaDirectives: ["client", "rest"],
      includes: ["src/**/*.vue", "src/**/*.js", "src/**/*.gql"],
    },
  ],
};
