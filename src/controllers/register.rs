use std::borrow::Borrow;

use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::account_info::{next_account_info, AccountInfo};
use solana_program::address_lookup_table::instruction;
use solana_program::entrypoint::ProgramResult;
use solana_program::msg;
use solana_program::program_error::ProgramError;
use solana_program::pubkey::Pubkey;
use solana_program::system_instruction::{self, SystemInstruction};

use crate::model::{Account, AccountList};
use crate::{Command, CommandRegister, KeyValue};

pub fn register(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let account_iter = &mut accounts.iter();
    // this should global account
    let payer = next_account_info(account_iter)?;
    let global_account = next_account_info(account_iter)?;
    // let system_program_account = next_account_info(account_iter)?;
    

    // let rent = Rent::get()?;
    // let rent_lamports = rent.minimum_balance(std::mem::size_of::<Account>());

    // invoke(
    //     &system_instruction::create_account(payer.key, global_account.key, rent_lamports,std::mem::size_of::<Account>() as u64, program_id)
    //     , &[payer.clone(), global_account.clone(), system_program_account.clone()])?;
    
    let mut new_account_data = global_account.try_borrow_mut_data()?;
    
    let mut storages = solana_program::borsh1::try_from_slice_unchecked::<AccountList>(&new_account_data)?;
    msg!("account info {:?} ", storages);
    let data = Command::try_from_slice(instruction_data)?;
    let key_value = data.key_value;
    let mut account: Account = Account::new();
    account.pub_key = "test".to_string();
    let _ = key_value.into_iter().map(|kv| {
        msg!("call here in loop");
        if kv.key == String::from("email") {
            // account.email = kv.value.clone();
            account.set_name(&kv.value)
        } 
        if kv.key == String::from("name") { 
            account.set_email(&kv.value)

        }
        if kv.key == String::from("roles") {
            // account.roles = kv.value.parse::<u8>().unwrap();
            account.set_roles(kv.value.parse::<u8>().unwrap())
        }
        return kv;
    }).collect::<Vec<KeyValue>>();
    
    msg!("size of string {:?}", "zulfikralahmudin".to_string().len());
    storages.accounts.push(account);
  
    msg!("size account {:?}", storages.accounts.len() + std::mem::size_of::<AccountList>());
    msg!("storages {:?}", storages);
    msg!("global account {:?}", storages);
    match storages.serialize(&mut *new_account_data) {
        Ok(_) => (),
        Err(err) => {
            msg!("Error: {:?}", err);
            return Err(ProgramError::InvalidInstructionData);
        },
    };
    
    Ok(())
}