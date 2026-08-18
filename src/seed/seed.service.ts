import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;
  constructor(
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({});

    const { data } = await axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    //const insertPromiseArray: Promise<any>[] = [];
    const pokemonToInsert: { name: string; no: number }[] = [];
    for (const { name, url } of data.results) {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      //insertPromiseArray.push(this.pokemonModel.create({ no, name }));

      pokemonToInsert.push({ name, no });

      console.log({ name, no });
    }
    //await Promise.all(insertPromiseArray);
    await this.pokemonModel.insertMany(pokemonToInsert);
    return 'seed executed';
  }
}
