import __variableDynamicImportRuntimeHelper from "vite/dynamic-import-helper";
const getTestData = async () => {
  const filename = "message";
  console.log(await __variableDynamicImportRuntimeHelper((import.meta.glob("./data/something/*.json")), `./data/something/${filename}.json`));
  console.log(await __variableDynamicImportRuntimeHelper((import.meta.glob("./data/whatever/*.json")), `./data/whatever/${filename}.json`));
};

getTestData();
const _sfc_main = {};

import { mergeProps as _mergeProps } from "vue"
import { ssrRenderAttrs as _ssrRenderAttrs, ssrInterpolate as _ssrInterpolate } from "vue/server-renderer"

function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${
    _ssrRenderAttrs(_mergeProps({ class: "whatever" }, _attrs))
  }>${
    _ssrInterpolate(new Date())
  }</div>`)
}


import { useSSRContext as __vite_useSSRContext } from 'vue'
const _sfc_setup = _sfc_main.setup
_sfc_main.setup = (props, ctx) => {
  const ssrContext = __vite_useSSRContext()
  ;(ssrContext.modules || (ssrContext.modules = new Set())).add("App.vue")
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined
}
import _export_sfc from 'plugin-vue:export-helper'
export default /*#__PURE__*/_export_sfc(_sfc_main, [['ssrRender',_sfc_ssrRender],['__file',"/Users/aryse/Projects/open-source/vite-ssr-issue-vue-sfc-dynamic-import/App.vue"]])
