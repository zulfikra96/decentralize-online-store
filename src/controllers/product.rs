use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo}, borsh1, entrypoint::ProgramResult, msg, program_error::ProgramError, pubkey::Pubkey, rent::Rent, sysvar::Sysvar
};


use crate::{model::{Product, ProductList}, Command, KeyValue};

pub fn add_product(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    // let id = Pubkey::new_unique();
    let accounts_iter = &mut accounts.iter();
    let payer = next_account_info(accounts_iter)?;
    let pda = next_account_info(accounts_iter)?;
    // let system_program_account = next_account_info(accounts_iter)?;
    let mut global_pda_data = pda.try_borrow_mut_data()?;

    // let rent = Rent::get()?;
    // let max_transaction = 100;
    // let space = std::mem::size_of::<ProductList>();
    // let rent_lamports = rent.minimum_balance(space);
    // let global_seed = "global";
    // let (pda, bump) = Pubkey::find_program_address(&[global_seed.as_bytes()], program_id);
    let instruction = borsh1::try_from_slice_unchecked::<Command>(&instruction_data)?;
    let key_value = instruction.key_value;
    let mut products = borsh1::try_from_slice_unchecked::<ProductList>(&global_pda_data).map_err(|err| {
        msg!("Error slice product {:?} {:?}", err, line!());
        err
    })?;
    msg!("products {:?} ", products);

    let mut product: Product = Product  {
        id: String::from(""),
        name: String::from(""),
        qt: 0,
        price: 0.0
    };
    let _ = key_value
        .into_iter()
        .map(|kv| {
            if kv.key == String::from("id") {
                product.id = kv.value.clone();
            }
            // msg!("call here in loop");
            if kv.key == String::from("name") {
                product.name = kv.value.clone();
            }
            if kv.key == String::from("qt") {
                product.qt = kv.value.parse::<u64>().unwrap();
            }
            if kv.key == String::from("price") {
                product.price = kv.value.parse::<f64>().unwrap();
             }
            // if kv.key == String::from("roles") {
            //     // account.roles = kv.value.parse::<u8>().unwrap();
            //     account.set_roles(kv.value.parse::<u8>().unwrap())
            // }
            return kv;
        })
        .collect::<Vec<KeyValue>>();
    products.products.push(product);

    match products.serialize(&mut *global_pda_data) {
        Ok(_) => (),
        Err(err) => {
            msg!("Error: {:?}", err);
            return Err(ProgramError::InvalidInstructionData);
        }
    };
    Ok(())
}
