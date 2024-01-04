import type { Hanzi } from "@/stores/hanzi";

export default interface CharacterProvider {
  getCharacter(): Hanzi
}
