use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::pubkey::Pubkey;


#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct Product {
    pub name: String,
    pub qt: usize,
    pub price: u64,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct Account {
    pub pub_key: Option<Pubkey>,
    pub name: String,
    pub email:  String,
    pub roles: u8,
    pub image_url: String,
    pub products: Vec<Product>,
}

impl Account {
    pub fn new() -> Account {
        Account {
            pub_key: None,
            name: String::from(""),
            email: String::from(""),
            roles: 0,
            image_url:"".to_string(),
            products:vec![]
        }
    }

    pub fn set_name(&mut self, name: &String)  {
        self.name = name.to_string();   
    }

    pub fn set_email(&mut self, email: &String)  {
        self.email = email.to_string();   
    }

    pub fn set_roles(&mut self, roles: u8)  {
        self.roles = roles;   
    }
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct AccountList {
    pub accounts: Vec<Account>,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct ProductList {
    pub products: Vec<Product>,
}