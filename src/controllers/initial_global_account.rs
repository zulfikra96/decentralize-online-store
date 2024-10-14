use std::borrow::Borrow;

use ::borsh::{BorshDeserialize, BorshSerialize};
use solana_program::program::invoke;
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    borsh, borsh0_10, borsh1,
    entrypoint::ProgramResult,
    msg,
    program::invoke_signed,
    program_error::ProgramError,
    pubkey::Pubkey,
    rent::Rent,
    system_instruction,
    sysvar::Sysvar,
};

use crate::model::{AccountList, ProductList};

pub fn initial_global_account(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
    let account_iter = &mut accounts.iter();
    let payer = next_account_info(account_iter).map_err(|err| {
        msg!("Error: Invalid account info {:?} {:?}", err, line!());
        ProgramError::InvalidInstructionData
    })?;
    let drive_pda = next_account_info(account_iter).map_err(|err| {
        msg!("Error: Invalid account info {:?} {:?}", err, line!());
        ProgramError::InvalidInstructionData
    })?;
    let system_program_account = next_account_info(account_iter).map_err(|err| {
        msg!("Error: Invalid account info {:?} {:?}", err, line!());
        ProgramError::InvalidInstructionData
    })?;

    let rent = Rent::get()?;
    let max_transaction = 100;
    let space =
        std::mem::size_of::<AccountList>() + max_transaction * std::mem::size_of::<ProductList>();
    // let base = payer.key;
    let rent_lamports = rent.minimum_balance(space);
    let global_seed = "global";

    let (pda, bump) = Pubkey::find_program_address(&[global_seed.as_bytes()], program_id);

    if *drive_pda.key != pda {
        msg!("Error account already initialized");
        return Err(ProgramError::IncorrectProgramId);
    }
    // let pda = match Pubkey::create_with_seed(payer.key, global_seed, program_id) {
    //     Ok(address) => address,
    //     Err(err) => {
    //         msg!("Error: {:?} {:?}", err, line!());
    //         return Err(ProgramError::InvalidInstructionData);
    //     }
    // };

    // msg!("PDA Address {:?}", drive_pda);
    // create account new account
    match invoke_signed(
        &system_instruction::create_account(
            payer.key,
            &pda,
            rent_lamports,
            space as u64,
            program_id,
        ),
        &[
            payer.clone(),
            drive_pda.clone(),
            system_program_account.clone(),
        ],
        &[&[global_seed.as_bytes(), &[bump]]],
    ) {
        Ok(_) => (),
        Err(err) => {
            msg!("Error: {:?} {:?}", err, line!());
            return Err(ProgramError::InvalidInstructionData);
        }
    };
    let mut data = match drive_pda.try_borrow_mut_data() {
        Ok(data) => data,
        Err(err) => {
            msg!("Error: {:?} {:?}", err, line!());
            return Err(ProgramError::InvalidInstructionData);
        }
    };
    msg!("len data {:?} space is {:?}", data.borrow().len(), space);
    let account_size = std::mem::size_of::<AccountList>();
    let account_data = &data[0..account_size];
    let mut account = match borsh1::try_from_slice_unchecked::<AccountList>(&account_data) {
        Ok(account) => account,
        Err(err) => {
            msg!("Error: {:?} {:?}", err, line!());
            return Err(ProgramError::InvalidInstructionData);
        }
    };

    let mut products = match borsh1::try_from_slice_unchecked::<ProductList>(&data) {
        Ok(products) => products,
        Err(err) => {
            msg!("Error: {:?} {:?}", err, line!());
            return Err(ProgramError::InvalidInstructionData);
        }
    };

    account.accounts = vec![];
    products.products = vec![];

    match account.serialize(&mut *data) {
        Ok(_) => (),
        Err(err) => {
            msg!("Error: {:?}", err);
            return Err(ProgramError::InvalidInstructionData);
        }
    };
    match products.serialize(&mut *data) {
        Ok(_) => (),
        Err(err) => {
            msg!("Error: {:?}", err);
            return Err(ProgramError::InvalidInstructionData);
        }
    };
    msg!("Success to create account");
    Ok(())
}
