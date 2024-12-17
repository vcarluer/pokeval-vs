import axios from 'axios';
import { config } from '../config';

export const searchCards = async (searchData) => {
  try {
    let query = `name:"${searchData.name}*"`;
    if (searchData.subtype) {
      query += ` subtypes:"${searchData.subtype}*"`;
    }
    if (searchData.hp) {
      query += ` hp:"${searchData.hp}"`;
    }

    const response = await axios.get(`${config.pokemonTcg.baseUrl}/cards`, {
      params: {
        q: query,
        orderBy: 'set.releaseDate',
        page: 1,
        pageSize: config.pokemonTcg.pageSize
      },
      headers: {
        'X-Api-Key': config.pokemonTcg.apiKey
      }
    });

    return response.data.data;
  } catch (error) {
    console.error('Error searching Pokemon cards:', error);
    throw error;
  }
};
