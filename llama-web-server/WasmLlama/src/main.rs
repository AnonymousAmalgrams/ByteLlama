use image;
use std::ffi::CString;
use std::os::raw::{c_char, c_int};
use std::ptr;
use std::convert::TryInto;
use std::env;
use std::fs;
use std::fs::File;
use std::io::Read;
use wasi_nn;

#[link(name = "libllama.so")]

#[repr(C)]
struct llama_context-params
{
        "seed": c_uint32,
        "n_ctx": c_int32,
        "n_batch": c_int32,
        "n_gqa": c_int32,
        "rms_norm_eps": c_float,
        "n_gpu_layers": c_int32,
        "main_gpu": c_int32,
        "tensor_split": POINTER(c_float),
        "rope_freq_base": c_float,
        "rope_freq_scale": c_float,
        "progress_callback": llama_progress_callback,
        "progress_callback_user_data": c_void_p,
        "low_vram": c_bool,
        "f16_kv": c_bool,
        "logits_all": c_bool,
        "vocab_only": c_bool,
        "use_mmap": c_bool,
        "use_mlock": c_bool,
        "embedding": c_bool,
}

llama_context_params_p = &(llama_context_params)

llama_context_p = c_void_p


extern "C" {
    fn llama_init_from_file(path: &str, params: llama_context_params) -> llama_context_p
}

extern "C" {
    fn llama_token_to_str(
        ctx: llama_context_params_p,
        tokens: *mut c_int,
    ) -> *const c_char;
}

extern "C" {
    fn llama_tokenize(
        ctx: *mut llama_context,
        text: *const c_char,
        tokens: *mut c_int,
        n_max_tokens: c_int,
        add_bos: bool,
    ) -> c_int;
}

pub fn main() {
    let args: Vec<String> = env::args().collect();
    let model_bin_name: &str = &args[1];
    let text_input: &str = &args[2];

    let graph = wasi_nn::GraphBuilder::new(
        wasi_nn::GraphEncoding::Pytorch,
        wasi_nn::ExecutionTarget::CPU,
    )
    .build_from_files([model_bin_name])
    .unwrap();
    println!("Loaded graph into wasi-nn with ID: {}", graph);

    let context = graph.init_execution_context().unwrap();
    println!("Created wasi-nn execution context with ID: {}", context);

        // // Add a space in front of the first character to match OG llama tokenizer behavior
        // params.prompt.insert(0, 1, ' ');

    Load tokenized sequence into tensor format
    // tokenize the prompt
    let mut tokens: Vec<llama_token>;

    let N = unsafe {
        llama_tokenize(
            &mut llama_context,
            c_text.as_ptr(),
            tokens.as_mut_ptr(),
            max_tokens as c_int,
            add_bos,
        )
    };

    println!("Read input tensor, size in bytes: {}", tensor_data.len());
    let tensor = wasi_nn::Tensor {
        dimensions: &[N],
        type_: wasi_nn::TENSOR_TYPE_U8,
        data: &tensor_data,
    };

    unsafe {
        wasi_nn::set_input(context, 0, tensor).unwrap();
    }

    // Execute the inference.
    unsafe {
        wasi_nn::compute(context).unwrap();
    }
    println!("Executed graph inference");
 
    //Retrieve the output.
    let mut output_buffer = vec![0u8; 1000];
    unsafe {
        wasi_nn::get_output(
            context,
            0,
            &mut output_buffer[..] as *mut [u8] as *mut u8,
            (output_buffer.len() * 4).try_into().unwrap(),
        )
        .unwrap();
    }

    for i in output_buffer
    {
        println(
            {
                unsafe {
                    llama_token_to_str(llama_context_p, i);
                }
            }
        )
    }

    let results = sort_results(&output_buffer);
    for i in 0..5 {
        println!(
            "   {}.) [{}]({:.4}){}",
            i + 1,
            results[i].0,
            results[i].1,
            imagenet_classes::IMAGENET_CLASSES[results[i].0]
        );
    }
}

// A wrapper for class ID and match probabilities.
#[derive(Debug, PartialEq)]
struct InferenceResult(usize, f32);