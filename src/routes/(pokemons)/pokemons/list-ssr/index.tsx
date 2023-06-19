import { component$, useComputed$, useSignal, $, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { DocumentHead, Link, routeLoader$, useLocation } from '@builder.io/qwik-city';

import { PokemonImage } from '~/components/pokemons/pokemon-image';
import { Modal } from '~/components/shared';
import { getFunFactAboutPokemon } from '~/helpers/get-chat-gpt-response';
import { getSmallPokemons } from '~/helpers/get-small-pokemon';
import { SmallPokemon } from '~/interfaces';

export const usePokemonList = routeLoader$<SmallPokemon[]>(
  async ({ query, redirect, pathname }) => {
    const offset = Number(query.get("offset") || 0);

    if (offset < 0) redirect(301, pathname);

    return await getSmallPokemons(offset);
  }
);

export default component$(() => {
  const pokemons = usePokemonList();
  const location = useLocation();

  const modalVisible = useSignal(false);
  const modalPokemon = useStore({
    id: '',
    name: ''
  });

  const chatGptPokemonFact = useSignal('');

  // Modal functions
  const showModal = $((id: string, name: string) => {
    modalPokemon.id = id;
    modalPokemon.name = name;
    modalVisible.value = true;
  });

  const closeModal = $(() => {
    modalVisible.value = false;
  });

  //TODO: Probar async
  useVisibleTask$(({ track }) => {
    track(() => modalPokemon.name);

    chatGptPokemonFact.value = '';

    if (modalPokemon.name.length > 0) {
      getFunFactAboutPokemon(modalPokemon.name)
      .then(resp => chatGptPokemonFact.value = resp);
    }
  });

  const currentOffSet = useComputed$<number>(() => {
    const offSetString = new URLSearchParams(location.url.search);
    return Number(offSetString.get("offset") || 0);
  });

  return <>
    <div class="flex flex-col">
      <span class="my-5 text-5xl">Status</span>
      <span>Offset: {currentOffSet}</span>
      <span>Está cargando página: {location.isNavigating ? "Si" : "No"}</span>
    </div>
    <div class="mt-10">
      <Link
        href={`/pokemons/list-ssr/?offset=${currentOffSet.value - 10}`}
        class="btn btn-primary mr-2">
        Anteriores
      </Link>
      <Link
        href={`/pokemons/list-ssr/?offset=${currentOffSet.value + 10}`}
        class="btn btn-primary mr-2">
        Siguientes
      </Link>
    </div>
    <div class="grid grid-cols-6 mt-5">
      {
        pokemons.value.map(({ name, id }) => (
          <div key={name}
            //onClick$={() => modalVisible.value = true} 
            onClick$={() => showModal(id, name)}
            class="m-5 flex flex-col justify-center items-center">
            <PokemonImage id={id} />
            <span class="capitalize">{name}</span>
          </div>
        ))
      }
    </div>

    <Modal
      persistent
      closeFn={closeModal}
      showModal={modalVisible.value}>
      <div q:slot='title'>{modalPokemon.name}</div>
      <div q:slot='content' class="flex flex-col justify-center items-start">
        <PokemonImage id={modalPokemon.id} />
        <span>Preguntadole a ChatGPT</span> 
        {/* <span>{chatGptPokemonFact.value === '' ? 'Preguntando a ChatGPT' : chatGptPokemonFact}</span> */}
      </div>
    </Modal>

  </>
});

export const head: DocumentHead = {
  title: 'List SSR',
};