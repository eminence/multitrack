use std::io::Cursor;

use wasm_bindgen::prelude::*;

mod utils;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern {
    fn alert(s: &str);

    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}


macro_rules! console_log {
    // Note that this is using the `log` function imported above during
    // `bare_bones`
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}


#[wasm_bindgen]
pub async fn decode(file: js_sys::Uint8Array) -> Result<(), JsValue> {
    // console_log!("Trying to decode file of size {}", file.size());
    // get first 1000 bytes
    // // let slice = file.slice_with_i32_and_i32(0, 1000)?;
    // let arr_buf = JsFuture::from(file.array_buffer()).await?;
    // let arr_buf = js_sys::Uint8Array::from(arr_buf);
    // let bytes = arr_buf.to_vec();
    // console_log!("have {} bytes in array buffer {} in vec", arr_buf.byte_length(), bytes.len());
    // assert_eq!(bytes.len(), arr_buf.byte_length() as usize);

    let bytes = file.to_vec();
    console_log!("have {} bytes in uint array", bytes.len());

    let mut rdr = ogg::PacketReader::new(Cursor::new(bytes));
    let ((ident_header, _comment_header, setup_header), _baz) = lewton::inside_ogg::read_headers(&mut rdr)
    .map_err(|e| format!("read_headers error: {:?}", e))?;

    console_log!("Decoded headers!");
    console_log!("Ident header:");
    console_log!("audio channels: {}", ident_header.audio_channels);
    console_log!("sample rate: {}", ident_header.audio_sample_rate);

    let mut wind = lewton::audio::PreviousWindowRight::new();
    let mut count = 0;
    while let Ok(Some(p)) = rdr.read_packet() {
        let decoded = lewton::audio::read_audio_packet(&ident_header, &setup_header, &p.data, &mut wind)
        .map_err(|e| format!("read_audio_packet error: {:?}",e))?;

        // we should have 2 vecs, each of ???? samples
        for (chan_idx, chan) in decoded.iter().enumerate() {
            // console_log!("chan {} has {} samples", chan_idx, chan.len());
        }
        count += 1;
        if count > 100 {
            break;
        }

    }

    console_log!("Done!");

    

    Ok(())
}

#[wasm_bindgen]
pub fn add_two(num: u32) -> u32 {
    num + 2
}

#[wasm_bindgen]
pub fn foo() -> Result<(), JsValue> {
    let _window = web_sys::window().ok_or("missing window")?;

    Ok(())
}

#[wasm_bindgen]
pub fn greet() {
    utils::set_panic_hook();

    alert("Hello, hello-wasm!");
}