import { isExisty } from '../../lib/helpers';

export function canDeepZoom(image) {
  return (
    isExisty(image.tile_base_url) &&
    isExisty(image.tile_size) &&
    isExisty(image.tile_overlap) &&
    isExisty(image.tile_format) &&
    isExisty(image.max_tiled_height) &&
    isExisty(image.max_tiled_width)
  );
}

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} from 'graphql';

const DeepZoomType = new GraphQLObjectType({
  name: 'DeepZoom',
  fields: {
    Image: {
      resolve: (image) => image,
      type: new GraphQLObjectType({
        name: 'DeepZoomImage',
        fields: {
          xmlns: {
            type: GraphQLString,
            resolve: () => 'http://schemas.microsoft.com/deepzoom/2008',
          },
          Url: {
            type: GraphQLString,
            resolve: ({ tile_base_url }) => {
              return tile_base_url
                // Ensure trailing slash
                .replace(/\/?$/, '/');
            },
          },
          Format: {
            type: GraphQLString,
            resolve: ({ tile_format }) => tile_format,
          },
          TileSize: {
            type: GraphQLInt,
            resolve: ({ tile_size }) => tile_size,
          },
          Overlap: {
            type: GraphQLInt,
            resolve: ({ tile_overlap }) => tile_overlap,
          },
          Size: {
            resolve: (image) => image,
            type: new GraphQLObjectType({
              name: 'DeepZoomImageSize',
              fields: {
                Width: {
                  type: GraphQLInt,
                  resolve: ({ max_tiled_width }) => max_tiled_width,
                },
                Height: {
                  type: GraphQLInt,
                  resolve: ({ max_tiled_height }) => max_tiled_height,
                },
              },
            }),
          },
        },
      }),
    },
  },
});

export default {
  type: DeepZoomType,
  resolve: (image) =>
    canDeepZoom(image) ? image : null,
};
