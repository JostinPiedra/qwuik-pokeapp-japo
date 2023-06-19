import { $, component$, useContext, useSignal } from '@builder.io/qwik';
import { DocumentHead, useNavigate } from '@builder.io/qwik-city';
import { PokemonImage } from '~/components/pokemons/pokemon-image';

import { usePokemonGame } from '~/hooks/use-pokemon-game';

export default component$(() => {

  const nav = useNavigate();
  const { 
    isPokemonVisible,
    nextPokemon,
    pokemonId,
    prevPokemon,
    showBackImage,
    toggleFromBack,
    toggleVisible
  }
    = usePokemonGame();

  const goToPokemon = $((id: number) => {
    nav(`/pokemon/${id}/`);
  });


  return (
    <>
      <span class="text-2xl">Buscador simple</span>
      <span class="text-9xl">{pokemonId.value}</span>

      <div onClick$={() => goToPokemon(pokemonId.value)}>
        <PokemonImage id={pokemonId.value} backImage={showBackImage.value} isVisible={isPokemonVisible.value} />
      </div>

      <div>
        <button onClick$={prevPokemon} class="btn btn-primary mr-2">Anterior</button>
        <button onClick$={nextPokemon} class="btn btn-primary mr-2">Siguiente</button>
        <button onClick$={toggleFromBack} class="btn btn-primary mr-2">Voltear</button>
        <button onClick$={toggleVisible} class="btn btn-primary">Revelar</button>
      </div>

    </>
  );
});

export const head: DocumentHead = {
  title: 'PokeQwik',
  meta: [
    {
      name: 'description',
      content: 'Esta es mi primera aplicacion en Qwik',
    },
  ],
};
