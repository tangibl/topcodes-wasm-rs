//! Test suite for the Web and headless browsers.

#![cfg(target_arch = "wasm32")]

extern crate wasm_bindgen_test;
use topcodes_wasm::scan;
use wasm_bindgen::JsValue;
use wasm_bindgen_test::*;

wasm_bindgen_test_configure!(run_in_browser);

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

    let expected: Vec<JsValue> = vec![JsValue::from_str(
        "{\"code\":61,\"unit\":7.6,\"orientation\":-0.07249829200591831,\"x\":31.5,\"y\":30.5}",
    )];
    assert_eq!(expected, result);
    Ok(())
}
