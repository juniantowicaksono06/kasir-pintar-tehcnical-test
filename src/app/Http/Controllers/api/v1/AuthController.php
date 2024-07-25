<?php 
namespace App\Http\Controllers\api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller {
    /**
     * Handle the registration request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
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
            'id'        => (string) \Illuminate\Support\Str::uuid(),
            'nip'       => $request->nip,
            'name'      => $request->name,
            'email'     => $request->email,
            'phone'     => $request->phone,
            'password'  => Hash::make($request->password),
            'role'      => $request->role,
            'picture'   => $request->picture
        ]);

        $response = [
            'code'      => 201,
            'message'   => "User berhasil dibuat!",
            'data'      => [
                'user'  => $user
            ]
        ];

        return response()->json($response, 201);
    }

    /**
     * Handle the login request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $credentials = $request->only('nip', 'password');

        // Validate the request data
        $validator = Validator::make($request->all(), [
            'nip'       => 'required|string|min:13',
            'password'  => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'code'      => 400,
                'errors'    => $validator->errors()
            ], 200);
        }
        $user = User::where('nip', $credentials['nip'])->first();
        if (!$user || !Hash::check($credentials['password'], $user->password) || $user->status !== 'active') {
            return response()->json(
                [
                    'code'  => 401,
                    'error' => 'Invalid credentials or inactive user'
                ], 200);
        }

        // Attempt to authenticate the user
        if (!$token = Auth::attempt($credentials)) {
            return response()->json([
                'code'       => 401,
                'errors'     => "NIP atau password anda salah"
            ], 200);
        }

        // Get the authenticated user
        $user = Auth::user();

        // Encode user information into JWT
        $token = JWTAuth::fromUser($user);

        // Store JWT in a cookie
        $cookie = cookie('token', $token, 1440); // Cookie valid for 1 day

        return response()->json([
            'code'      => 200,
            'message'   => 'Berhasil login'
        ])
        ->withCookie($cookie);
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        $token = $request->cookie('token');

        try {
            JWTAuth::setToken($token)->invalidate();
            return response()->json([
                'code'      => 200,
                'message'   => 'Berhasil logout'
            ])
            ->withCookie(cookie('token', '', -1));
        } catch (JWTException $e) {
            return response()->json([
                'code'      => 500,
                'errors'    => 'Failed to logout, please try again'
            ], 500);
        }
    }
}