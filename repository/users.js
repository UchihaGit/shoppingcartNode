const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository {
  constructor(filename) {
      if (!filename) {
        throw new Error('Crearting a Repository requires a filename parameter');
      }
      this.filename = filename;

      try{
        //check to see if file exists
        fs.accessSync(this.filename)
      }catch(err){
        //if not creates the file
        fs.writeFileSync(this.filename, '[]')
      }
  }

  async getAll(){
      //read contents of a file
      return JSON.parse(await fs.promises.readFile(this.filename,{encoding:'utf8'}));

      // console.log(contents);
      //
      // const data = JSON.parse(contents);
      //
      // return data;
  }

  //create records
  async create(attrs){
    attrs.id = this.randomId();

    const salt = crypto.randomBytes(8).toString('hex');
    const buf = await scrypt(attrs.password, salt,64)

    const records = await this.getAll();

    const record = {
      ...attrs, password: `${buf.toString('hex')}.${salt}`
    }
    records.push(record);

    await this.writeAll(records);

    return record;
  }

  async comparePasswords(saved, supplied){

    const[hashed, salt] = saved.split('.');
    const hashesdSuppliedBuf = await scrypt(supplied, salt, 64);

     return hashed === hashesdSuppliedBuf.toString('hex');
  }

  //write the newly created record into the file
  async writeAll(records){
    await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
  }

  //generate random id
  randomId(){
    return crypto.randomBytes(4).toString('hex');
  }

  //get one record
  async getOne(id){
    const records = await this.getAll();
    return records.find(record => record.id ===id);
  }

  async delete(id){
    const records = await this.getAll();
    const filterRecords =  records.filter(record => record.id !== id);
    await this.writeAll(filterRecords);
  }

  async update(id, attrs){
    const records = await this.getAll();
    const record = records.find(record => record.id===id);
    if (!record) {
      throw new Error(`id ${id}is not valid`)
    }
    Object.assign(record, attrs);
    await this.writeAll(records);
  }

  async getOneBy(filters){
    const records = await this.getAll();
    for (let record of records) {
      let found = true;
      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }
      if (found) {
        return record;
      }
    }
  }
}

// const test = async () =>{
// const repo = new UsersRepository('users.json');
//
// // const user = await repo.getOne("fudbckbc");
//
// //await repo.delete('dsdfdsffsdfd')
//
// // await repo.update('ssss', {address: 'address'});
// // const users = await repo.getAll();
//
// const users = await repo.getOneBy({id:'b080b935'});
// console.log(users);
// }
//
// test();

module.exports = new UsersRepository('users.json');
