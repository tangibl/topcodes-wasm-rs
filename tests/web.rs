//! Test suite for the Web and headless browsers.

#![cfg(target_arch = "wasm32")]

extern crate wasm_bindgen_test;

use serde::Deserialize;
use topcodes_wasm::scan;
use wasm_bindgen_test::*;

wasm_bindgen_test_configure!(run_in_browser);

#[derive(Deserialize)]
struct TopCode {
    code: i32,
    unit: f32,
    orientation: f32,
    x: f32,
    y: f32,
}

fn approx_equal(a: f32, b: f32) -> bool {
    const EPSILON: f32 = 0.01;
    a + EPSILON > b && a - EPSILON < b
}

#[wasm_bindgen_test]
fn can_scan() -> Result<(), Box<dyn std::error::Error>> {
    let bytes = include_bytes!("./assets/start.bin");
    let width = 64;
    let height = 64;
    // Assert that the bin file has a rgba bytes for the right dimensions.
    assert_eq!(bytes.len(), width * height * 4);
    let buffer = js_sys::Uint8ClampedArray::new_with_length(width as u32 * height as u32 * 4);
    buffer.copy_from(bytes);

    let result = scan(&buffer, width, height).to_vec();

    // We expect a single start token
    assert_eq!(result.len(), 1);

    let topcode: TopCode = serde_wasm_bindgen::from_value(result[0].clone()).unwrap();
    assert_eq!(topcode.code, 61);
    assert_eq!(topcode.x, 31.5);
    assert_eq!(topcode.y, 30.5);
    assert!(approx_equal(topcode.unit, 7.6));
    assert!(approx_equal(topcode.orientation, -0.07));
    Ok(())
}
