use borsh::{BorshDeserialize, BorshSerialize};


#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct Product {
    pub name: String,
    pub qt: usize,
    pub price: u64,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct Account {
    pub pub_key: String,
    pub name: String,
    pub email:  String,
    pub roles: u8,
}

impl Account {
    pub fn new() -> Account {
        Account {
            pub_key: String::from(""),
            name: String::from(""),
            email: String::from(""),
            roles: 0
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