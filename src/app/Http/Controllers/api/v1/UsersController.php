<?php
namespace App\Http\Controllers\api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;

class UsersController extends Controller {
    public function get(Request $request) {
        try {
            $currentUser = $request->attributes->get('user');
            if($currentUser['role'] != 'direktur') {
                return response()->json([
                    "code"      => 401,
                    "errors"    => "Anda tidak memiliki akses untuk melihat user"
                ], 200);
            }
            $users = new User();
            $data = $users->get();
            if(empty($data)) {
                $data = [];
            }
            else {
                $data = $data->toArray();
            }
            return response()->json([
                'code'      => 200,
                'data'      => $data
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'code'      => 500,
                'errors'    => "Internal server error"
            ]);
        }
    }

    public function read(Request $request, String $id) {
        try {
            $currentUser = $request->attributes->get('user');
            if($currentUser['role'] != 'direktur') {
                return response()->json([
                    "code"      => 401,
                    "errors"    => "Anda tidak memiliki akses untuk melihat user"
                ], 200);
            }
            $users = new User();
            $data = $users->find($id);
            if(empty($data)) {
                $data = [];
            }
            else {
                $data = $data->toArray();
            }
            return response()->json([
                'code'      => 200,
                'data'      => $data
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'code'      => 500,
                'errors'    => "Internal server error"
            ]);
        }
    }
    public function create(Request $request)
    {
        try {
            $currentUser = $request->attributes->get('user');
            if($currentUser['role'] != 'direktur') {
                return response()->json([
                    "code"      => 401,
                    "errors"    => "Anda tidak memiliki akses untuk membuat user"
                ], 200);
            }
            // Validate the request data
            $validator = Validator::make($request->all(), [
                'name'      => 'required|string|max:200',
                'nip'       => 'required|string|min:13|unique:users',
                'email'     => 'required|string|email|max:200|unique:users',
                'phone'     => 'required|string|max:13',
                'password'  => 'required|string|min:6',
                'role'      => 'required|string|max:30',
                'picture'   => 'required|string'
            ]);
    
            if ($validator->fails()) {
                return response()->json([
                    'code'      => 400,
                    'errors'    => $validator->errors()
                ], 200);
            }
    
            // Create the user
            $user = User::create([
                'id'        => (string) Str::uuid(),
                'nip'       => $request->nip,
                'name'      => $request->name,
                'email'     => $request->email,
                'phone'     => $request->phone,
                'password'  => Hash::make($request->password),
                'role'      => $request->role,
                'picture'   => $request->picture,
                'status'    => 'active'
            ]);
    
            $response = [
                'code'      => 201,
                'message'   => "User berhasil dibuat!",
                'data'      => [
                    'user'  => $user
                ]
            ];
    
            return response()->json($response, 201);
        } catch (\Throwable $th) {
            return response()->json([
                'code'      => 500,
                'errors'    => "Internal server error"
            ]);
        }
    }
    public function edit(Request $request, String $id)
    {
        try {
            $currentUser = $request->attributes->get('user');
            if($currentUser['role'] != 'direktur') {
                return response()->json([
                    "code"      => 401,
                    "errors"    => "Anda tidak memiliki akses untuk membuat user"
                ], 200);
            }
            // Validate the request data
            $validator = Validator::make($request->all(), [
                'name'      => 'required|string|max:200',
                'nip'       => 'required|string|min:13',
                'email'     => 'required|string|email|max:200',
                'phone'     => 'required|string|max:13',
                'password'  => '',
                'role'      => 'required|string|max:30',
                'picture'   => 'string'
            ]);
    
            if ($validator->fails()) {
                return response()->json([
                    'code'      => 400,
                    'errors'    => $validator->errors()
                ], 200);
            }

            $dataToUpdate = [
                'nip'       => $request->nip,
                'name'      => $request->name,
                'email'     => $request->email,
                'phone'     => $request->phone,
                'role'      => $request->role
            ];

            if(array_key_exists('password', $request->all())) {
                if($request->password != '') {
                    $dataToUpdate['password'] = Hash::make($request->password);
                }
            }

            if(array_key_exists('picture', $request->all())) {
                if($request->picture != "") {
                    $dataToUpdate['picture'] = $request->picture;
                }
            }

            $user = User::where('email', $request->email)->orWhere('nip', $request->nip)->first();
            if($user) {
                if($user->id != $id) {
                    return response()->json([
                        'code'      => 400,
                        'errors'    => "Email atau NIP sudah terdaftar"
                    ], 200);
                }
            }

            User::where('id', $id)->update($dataToUpdate);
    
            $response = [
                'code'      => 201,
                'message'   => "User berhasil dibuat!"
            ];
    
            return response()->json($response, 201);
        } catch (\Throwable $th) {
            return response()->json([
                'code'      => 500,
                'errors'    => "Internal server error",
                'debug'     => $th->getMessage()    
            ]);
        }
    }
    public function delete(Request $request, String $id) {
        try {
            $currentUser = $request->attributes->get('user');
            if($currentUser['role'] != 'direktur') {
                return response()->json([
                    "code"      => 401,
                    "errors"    => "Anda tidak memiliki akses untuk membuat user"
                ], 200);
            }
            $user = User::where('id', $id)
            ->update([
                'status'    => 'deleted'
            ]);
            return response()->json([
                "code"      => 200,
                "message"   => "User berhasil dinonaktifkan"
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'code'      => 500,
                'errors'    => "Internal server error"
            ]);
        }
    }
    public function activate(Request $request, String $id) {
        try {
            $currentUser = $request->attributes->get('user');
            if($currentUser['role'] != 'direktur') {
                return response()->json([
                    "code"      => 401,
                    "errors"    => "Anda tidak memiliki akses untuk membuat user"
                ], 200);
            }
            $user = User::where('id', $id)
            ->update([
                'status'    => 'active'
            ]);
            return response()->json([
                "code"      => 200,
                "message"   => "User berhasil diaktifkan"
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'code'      => 500,
                'errors'    => "Internal server error"
            ]);
        }
    }
}