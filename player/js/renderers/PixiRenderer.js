import * as PIXI from 'pixi.js';
import {
  extendPrototype,
} from '../utils/functionExtensions';
import PixiRendererBase from './PixiRendererBase';
import Matrix from '../3rd_party/transformation-matrix';
import PXCompElement from '../elements/pixiElements/PXCompElement';

function PixiRenderer(animationItem, config) {
  console.log('PIXI Renderer', animationItem, config);
  this.animationItem = animationItem;
  this.layers = null;

  this.renderConfig = {
    dpr: (config && config.dpr) || window.devicePixelRatio || 1,
    progressiveLoad: (config && config.progressiveLoad) || false,
  };

  this.renderedFrame = -1;
  this.globalData = {
    frameNum: -1,
    _mdf: false,
    renderConfig: this.renderConfig,
    currentGlobalAlpha: -1,
  };
  this.elements = [];
  this.pendingElements = [];
  this.transformMat = new Matrix();
  this.completeLayers = false;
  this.rendererType = 'pixi';
}

extendPrototype([PixiRendererBase], PixiRenderer);

PixiRenderer.prototype.createComp = function (data) {
  console.log('Pixi create comp::', data);
  return false;
  // return new PXCompElement(data, this.globalData, this);
};

export default PixiRenderer;
