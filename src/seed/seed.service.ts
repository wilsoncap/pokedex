import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from '../common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({});

    const data = await this.http.get<PokeResponse>(
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
