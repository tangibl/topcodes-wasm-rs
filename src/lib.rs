mod utils;

use topcodes::Scanner;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {}

/// There's no great support for TypeScript types at the moment, so this definition must be kept in
/// sync with the Rust function(s) below.
#[wasm_bindgen(typescript_custom_section)]
const TS_APPEND_CONTENT: &'static str = r#"
export interface TopCode {
    /**
     * The symbol's code, -1 for invalid codes. Must be an integer.
     */
    code: number;
    /**
     * Width of a single ring.
     */
    unit: number;
    /**
     * Angular orientation of the symbol (in radians).
     */
    orientation: number;
    /**
     * The horizontal coordinate of the symbol center, starting from the left.
     */
    x: number;
    /**
     * The vertical coordinate of the symbol center, starting from the top.
     */
    y: number;
}

/**
 * @param {Uint8ClampedArray} buffer The source image buffer.
 * @param {number} width An integer value representing the width of the image.
 * @param {number} height An integer value representing the height of the image.
 * @returns {TopCode[]} A list of the detected TopCodes, with no duplicates.
 */
export function scan(buffer: Uint8ClampedArray, width: number, height: number): TopCode[];
"#;

#[wasm_bindgen(skip_typescript)]
pub fn scan(buffer: &js_sys::Uint8ClampedArray, width: usize, height: usize) -> js_sys::Array {
    let mut scanner = Scanner::new(width, height);

    let topcodes = scanner.scan(buffer, |buffer, index| {
        let index = index as u32 * 4;
        let r = buffer.get_index(index);
        let g = buffer.get_index(index + 1);
        let b = buffer.get_index(index + 2);
        (r as u32, g as u32, b as u32)
    });

    return topcodes
        .into_iter()
        .map(|code| JsValue::from_str(&code.to_json()))
        .collect::<js_sys::Array>();
}
