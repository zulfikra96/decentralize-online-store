use borsh::BorshSerialize;
use solana_program::{account_info::{next_account_info, AccountInfo}, borsh1::try_from_slice_unchecked, entrypoint::ProgramResult, msg, program_error::ProgramError, pubkey::Pubkey, rent::Rent, system_instruction, sysvar::Sysvar };
use solana_program::program::invoke;

use crate::model::{AccountList, ProductList};

pub fn initial_global_account(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
    
    let account_iter = &mut accounts.iter();
    let payer = next_account_info(account_iter)?;
    let global_account = next_account_info(account_iter)?;
    let system_program_account = next_account_info(account_iter)?;

    let rent = Rent::get()?;
    let max_transaction = 100;
    let space = 8 + std::mem::size_of::<AccountList>() + max_transaction * std::mem::size_of::<ProductList>();
    
    let rent_lamports = rent.minimum_balance(space);
    // create account new account
    invoke(
        &system_instruction::create_account(
            payer.key,
            global_account.key,
            rent_lamports,
            space as u64,
            program_id,
        ),
        &[payer.clone(), global_account.clone(), system_program_account.clone()],
    )?;

    let mut data = global_account.try_borrow_mut_data()?;

    let mut account = match try_from_slice_unchecked::<AccountList>(&data) {
        Ok(account) => account,
        Err(err) => {
            msg!("Error: {:?}", err);
            return Err(ProgramError::InvalidInstructionData);
        },
    };

    let mut products = match try_from_slice_unchecked::<ProductList>(&data) {
        Ok(products) => products,
        Err(err) => {
            msg!("Error: {:?}", err);
            return Err(ProgramError::InvalidInstructionData);
        },
    };
    
    account.accounts = vec![];
    products.products = vec![];

    match account.serialize(&mut *data) {
        Ok(_) => (),
        Err(err) => {
            msg!("Error: {:?}", err);
            return Err(ProgramError::InvalidInstructionData);
        },
    };
    match products.serialize( &mut *data) {
        Ok(_) => (),
        Err(err) => {
            msg!("Error: {:?}", err);
            return Err(ProgramError::InvalidInstructionData);
        },
    };
    msg!("Success to create account");
    Ok(())
}