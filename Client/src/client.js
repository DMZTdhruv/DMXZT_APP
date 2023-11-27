import {createClient} from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_ID,
  dataset: 'production',
  apiVersion: "2023-10-20",
  useCdn: false,
  token: import.meta.env.VITE_REACT_APP_SANITY_TOKEN,
  ignoreBrowserTokenWarning: true
})

const builder = imageUrlBuilder(client)

export const urlFor = (source) => builder.image(source);