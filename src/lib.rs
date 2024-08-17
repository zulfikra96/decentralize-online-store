mod controllers;

use crate::controllers::initial_global_account::initial_global_account;
mod model;
use borsh::{BorshDeserialize, BorshSerialize};
use model::{Account, AccountList, ProductList};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};
use solana_program::{program::invoke, system_instruction};
use solana_program::{rent::Rent, sysvar::Sysvar};
// use solana_sdk::address_lookup_table::instruction;

const ROLES: [&str; 3] = ["admin", "seller", "buyer"];
const INITIAL_CODE: &str = "generate1234";

// instruction or action;
const ACTION: [&str; 6] = ["initial","register", "login", "register","show-accounts","show-products"];

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct KeyValue {
    pub key: String,
    pub value: String,
}

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct Command {
    pub action: String,
    pub key_value: Vec<KeyValue>,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct CommandRegister {
    pub action: String,
    pub name: String,
    pub email: String,
    pub roles: u8
}

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {

    let accounts_iter = &mut accounts.iter();
    let _account = next_account_info(accounts_iter)?;
    let global_account = next_account_info(accounts_iter)?;
    let instruction = match Command::try_from_slice(instruction_data) {
        Ok(instruction) => instruction,
        Err(_) => {
            msg!("Invalid instruction {:?} ", instruction_data);
            return Err(ProgramError::InvalidInstructionData);
        }
    };

    if !ACTION.contains(&instruction.action.as_str()) {
        msg!("Invalid instruction {:?} ", instruction);
        return Err(ProgramError::InvalidInstructionData);
    }


    let new_account = next_account_info(accounts_iter)?;
    if instruction.action == "initial" && instruction.key_value[0].value == INITIAL_CODE {
        if new_account.owner == program_id {
            msg!("Account has been initialized");
            return Err(ProgramError::AccountAlreadyInitialized);
        }
        initial_global_account(program_id, accounts)?  
    } 


    if instruction.action == "register" { 
        controllers::register::register(program_id, accounts, instruction_data)?
    }

    if instruction.action == "show-products" {
        let storage_data= &global_account.try_borrow_mut_data()?;
        let storages = solana_program::borsh1::try_from_slice_unchecked::<ProductList>(&storage_data)?;
        msg!("storage data {:?}", storages);

    }

    if instruction.action == "show-accounts" {
        let storage_data= &global_account.try_borrow_mut_data()?;
        let storages = solana_program::borsh1::try_from_slice_unchecked::<AccountList>(&storage_data)?;
        msg!("storage data {:?}", storages);
    }
   
    
    msg!("Success execute program {:?}", instruction_data);
    Ok(())
}
