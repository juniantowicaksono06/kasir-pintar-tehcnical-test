<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use \Illuminate\Support\Str;


class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table("users")->insert([
            [
                'id'        => Str::uuid()->toString(),
                'nip'       => '1234567890121',
                'name'      => 'John Doe',
                'email'     => 'j9i6t@example.com',
                'phone'     => '081234567890',
                'password'  => Hash::make('Abcd1234'),
                'role'      => 'direktur',
                'picture'   => 'default-user.png'
            ],
            [
                'id'        => Str::uuid()->toString(),
                'nip'       => '1234567890126',
                'name'      => 'Jack Doe',
                'email'     => 'j9i7t@example.com',
                'phone'     => '081234567891',
                'password'  => Hash::make('Abcd1234'),
                'role'      => 'finance',
                'picture'   => 'default-user.png'
            ],
            [
                'id'        => Str::uuid()->toString(),
                'nip'       => '1234567890127',
                'name'      => 'Joe Doe',
                'email'     => 'j9i8t@example.com',
                'phone'     => '0812345678912',
                'password'  => Hash::make('Abcd1234'),
                'role'      => 'staff',
                'picture'   => 'default-user.png'
            ]
        ]);
    }
}
