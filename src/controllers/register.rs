use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::account_info::{next_account_info, AccountInfo};
use solana_program::entrypoint::ProgramResult;
use solana_program::{borsh1, msg};
use solana_program::program_error::ProgramError;
use solana_program::pubkey::Pubkey;

use crate::model::{Account, AccountList};
use crate::{Command, KeyValue};

pub fn register(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let account_iter = &mut accounts.iter();
    // this should global account
    let payer = next_account_info(account_iter)?;
    let global_account = next_account_info(account_iter)?;

    let mut new_account_data = global_account.try_borrow_mut_data()?;

    let mut storages = borsh1::try_from_slice_unchecked::<AccountList>(&new_account_data)?;
    let data = Command::try_from_slice(instruction_data)?;
    let key_value = data.key_value;
    let mut account: Account = Account::new();
    account.pub_key = Some(*payer.key);
    account.products = vec![];
    // Add to global storage
    let _ = key_value
        .into_iter()
        .map(|kv| {
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
        })
        .collect::<Vec<KeyValue>>();

    storages.accounts.push(account);
    msg!("Success to register");
    match storages.serialize(&mut *new_account_data) {
        Ok(_) => (),
        Err(err) => {
            msg!("Error: {:?}", err);
            return Err(ProgramError::InvalidInstructionData);
        }
    };

    Ok(())
}
