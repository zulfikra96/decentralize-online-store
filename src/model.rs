use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::pubkey::Pubkey;


#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct Product {
    pub id: String,
    pub name: String,
    pub qt: u64,
    pub price: f64,
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

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct AccountList {
    pub accounts: Vec<Account>,
}

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct ProductList {
    pub products: Vec<Product>,
}