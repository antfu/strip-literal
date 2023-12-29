import __variableDynamicImportRuntimeHelper from "                          ";
const getTestData = async () => {
  const filename = "       ";
  console.log(await __variableDynamicImportRuntimeHelper((import.meta.glob("                       ")), `                 ${filename}     `));
  console.log(await __variableDynamicImportRuntimeHelper((import.meta.glob("                      ")), `                ${filename}     `));
};

getTestData();
const _sfc_main = {};

import { mergeProps as _mergeProps } from "   "
import { ssrRenderAttrs as _ssrRenderAttrs, ssrInterpolate as _ssrInterpolate } from "                   "

function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`    ${
    _ssrRenderAttrs(_mergeProps({ class: "        " }, _attrs))
  } ${
    _ssrInterpolate(new Date())
  }      `)
}


import { useSSRContext as __vite_useSSRContext } from '   '
const _sfc_setup = _sfc_main.setup
_sfc_main.setup = (props, ctx) => {
  const ssrContext = __vite_useSSRContext()
  ;(ssrContext.modules || (ssrContext.modules = new Set())).add("       ")
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined
}
import _export_sfc from '                        '
export default              _export_sfc(_sfc_main, [['         ',_sfc_ssrRender],['      ',"                                                                               "]])