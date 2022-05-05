/* global extendPrototype, BaseElement, TransformElement, CVBaseElement,HierarchyElement, FrameElement,
RenderableElement, SVGShapeElement, IImageElement, createTag */
import * as PIXI from 'pixi.js';
import {
  extendPrototype,
} from '../../utils/functionExtensions';
import PXBaseElement from './PXBaseElement';
import BaseElement from '../BaseElement';
import TransformElement from '../helpers/TransformElement';
import HierarchyElement from '../helpers/HierarchyElement';
import FrameElement from '../helpers/FrameElement';
import RenderableElement from '../helpers/RenderableElement';
import IImageElement from '../ImageElement';
import RenderableDOMElement from '../helpers/RenderableDOMElement';

function PXImageElement(data, globalData, comp) {
  console.log('PXImageElement::constructor', data);
  this.assetData = globalData.getAssetData(data.refId);
  this.initElement(data, globalData, comp);
}
extendPrototype([BaseElement, TransformElement, PXBaseElement, HierarchyElement, FrameElement, RenderableElement], PXImageElement);

PXImageElement.prototype.initElement = RenderableDOMElement.prototype.initElement;

PXImageElement.prototype.createContent = function () {
  console.log('PXImageElement::createContent', this.assetData, this.data.hasMask);

  const imageAsset = this.globalData.imageLoader.getAsset(this.assetData);
  console.log('PXImageElement:: Image Asset', imageAsset.currentSrc);
  this.img = PIXI.Sprite.from(imageAsset.currentSrc); // new PIXI.Sprite();

  // this.img.width = this.assetData.w;
  // this.img.height = this.assetData.h;

  var imgW = this.img.width;
  var imgH = this.img.height;
  var imgRel = imgW / imgH;
  var canvasRel = this.assetData.w / this.assetData.h;
  var widthCrop;
  var heightCrop;
  var par = this.assetData.pr || this.globalData.renderConfig.imagePreserveAspectRatio;
  if ((imgRel > canvasRel && par === 'xMidYMid slice') || (imgRel < canvasRel && par !== 'xMidYMid slice')) {
    heightCrop = imgH;
    widthCrop = heightCrop * canvasRel;
  } else {
    widthCrop = imgW;
    heightCrop = widthCrop / canvasRel;
  }

  this.img.x = (imgW - widthCrop) / 2;
  this.img.y = (imgH - heightCrop) / 2;
  this.img.width = widthCrop;
  this.img.height = heightCrop;
  this.img.renderable = true;

  this.layerElement.addChild(this.img);
  console.log('PXImageElement:: done created image', this.hidden);
};

PXImageElement.prototype.renderInnerContent = function () {
  // const matProps = this.finalTransform.mat.props;
  // const matrix = new PIXI.Matrix(matProps[0], matProps[1], matProps[4], matProps[5], matProps[12], matProps[13]);
  // this.img.transform.setFromMatrix(matrix);
  // console.log('PXImage::renderInnerConent', matrix);
  console.log('PXImageElement::renderInnerContent()', this.img.renderable, this.img.width);
};

PXImageElement.prototype.showInnerContent = function () {
  // this.globalData.pixiApp.stage.addChild(this.img);
  console.log('PXImageElement::showInnerContent()');
  // this.img.renderable = true;
};

PXImageElement.prototype.hideInnerContent = function () {
  // this.globalData.pixiApp.stage.addChild(this.img);
  console.log('PXImageElement::hideInnerContent()');
  // this.img.renderable = false;
};

PXImageElement.prototype.destroy = function () {
  this.img = null;
};

export default PXImageElement;
