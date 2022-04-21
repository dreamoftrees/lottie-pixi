import * as PIXI from 'pixi.js';
import {
  extendPrototype,
} from '../utils/functionExtensions';
import {
  createSizedArray,
} from '../utils/helpers/arrays';
import Matrix from '../3rd_party/transformation-matrix';
import BaseRenderer from './BaseRenderer';

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

extendPrototype([BaseRenderer], PixiRenderer);

PixiRenderer.prototype.createNull = function (data) {
};

PixiRenderer.prototype.createShape = function (data) {
};

PixiRenderer.prototype.createText = function (data) {
};

PixiRenderer.prototype.createImage = function (data) {
  return null; // new PXImageElement(data, this.globalData, this);
};

PixiRenderer.prototype.createComp = function (data) {
};

PixiRenderer.prototype.createSolid = function (data) {
};

PixiRenderer.prototype.configAnimation = function (animData) {
  this.data = animData;
  this.layers = animData.layers;

  console.log('Pixi Animation', animData);
  this.pixiApp = new PIXI.Application({
    width: animData.w,
    height: animData.h,
    transparent: true, // 背景透明
    resolution: this.renderConfig.dpr,
  });
  this.animationItem.wrapper.appendChild(this.pixiApp.view);

  this.setupGlobalData(animData, document.body);
  this.globalData.pixiApp = this.pixiApp;
  this.globalData.progressiveLoad = this.renderConfig.progressiveLoad;

  this.elements = createSizedArray(animData.layers.length);
};

PixiRenderer.prototype.destroy = function () {
};

PixiRenderer.prototype.updateContainerSize = function () {
};

PixiRenderer.prototype.buildItem = function (pos) {
  var elements = this.elements;
  if (elements[pos] || this.layers[pos].ty === 99) {
    return;
  }
  var element = this.createItem(this.layers[pos], this, this.globalData);
  elements[pos] = element;
  element.initExpressions();
};

PixiRenderer.prototype.checkPendingElements = function () {
};

PixiRenderer.prototype.renderFrame = function (num, forceRender) {
  if ((this.renderedFrame === num && this.renderConfig.clearCanvas === true && !forceRender) || this.destroyed || num === -1) {
    return;
  }
  this.renderedFrame = num;
  this.globalData.frameNum = num - this.animationItem._isFirstFrame;
  this.globalData.frameId += 1;
  this.globalData._mdf = !this.renderConfig.clearCanvas || forceRender;
  this.globalData.projectInterface.currentFrame = num;

  console.log('--------');
  console.log('render frame: ', num);
  var i;
  var len = this.layers.length;
  if (!this.completeLayers) {
    this.checkLayers(num);
  }

  for (i = 0; i < len; i += 1) {
    if (this.completeLayers || this.elements[i]) {
      this.elements[i].prepareFrame(num - this.layers[i].st);
    }
  }
  if (this.globalData._mdf) {
    for (i = len - 1; i >= 0; i -= 1) {
      if (this.completeLayers || this.elements[i]) {
        this.elements[i].renderFrame();
      }
    }
  }
};

PixiRenderer.prototype.appendElementInPos = function (element, pos) {
};

PixiRenderer.prototype.hide = function () {
};

PixiRenderer.prototype.show = function () {
};
