const path = require('path');
require("dotenv").config({
   path: path.join(__dirname, '../.env')
});

const { Command } = require('commander');
const { AdminService } = require('../dist/admin/admin.service')
const { connect } = require('../dist/@utils/db');
const { Table } = require("console-table-printer");
const { setPasswordHash } = require('../dist/@utils/common');
const chalk = require('chalk');
const cmd = new Command();

cmd.name('admin <command>');

cmd.command('create')
   .description("Add new admin")
   .requiredOption('-f, --fullname <value>', "Admin's fullname")
   .requiredOption('-e, --email <value>', "Admin's email")
   .requiredOption('-p, --password <value>', "Admins's password")
   .action(_createAdmin);

cmd.command('list')
   .description("List of sa keys")
   .action(_showListOfAdmins);

cmd.command('remove <id>')
   .description("Remove sa key")
   .action(_removeAdmin);

cmd.parse();

async function _createAdmin(opts) {
   connect()
   .then(async (db) => {
      const adminService = new AdminService();
      const payload = await setPasswordHash(opts);
      const result = await adminService.create(payload);

      process.stdout.write("Admin has been created: " + chalk.green(result.insertedId) + '\n');
      db.close()
   })
}

async function _showListOfAdmins() {
   connect()
      .then(async (db) => {
         const adminService = new AdminService();
         const admins = await adminService.findAll();
         const table = new Table({
            columns: [
               { name: 'Id', alignment: 'left', color: 'green' },
               { name: 'Name', color: 'white_bold' },
               { name: 'Email', color: 'white_bold' }
            ]
         });

         if (Array.isArray(admins) && admins.length > 0) {
            admins.forEach(item => {
               table.addRow({
                  Id: item._id,
                  Name: item.fullname,
                  Email: item.email
               });
            });

            table.printTable();
         } else {
            process.stdout.write(chalk.gray("No admins\n"));
         }
         db.close();
      });
}

async function _removeAdmin(adminId) {
   connect()
   .then(async (db) => {
      const adminService = new AdminService();
      try {
         if (await adminService.has(adminId)) {
            await adminService.delete(adminId);
            process.stdout.write(chalk.blue("Admin successfully removed\n"));
         } else {
            process.stdout.write(chalk.grey("Admin not found\n"));
         }

      } catch (error) {
         if (error instanceof TypeError) {
            process.stdout.write(chalk.red("Invalid admin id\n"));
         } else {
            process.stdout.write(chalk.gray("Something went wrong\n"));
         }
      }
      db.close();
   })
}
