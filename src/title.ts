import { TitleConfig } from './type';
import { Layer } from 'spritejs';

export class Title {
  config: TitleConfig;
  constructor(config: TitleConfig) {
    this.config = config;
  }
  appendTo(layer: Layer) {
    // layer.appendChild(this)
  }
  getHeight() {

  }
}