<?php

namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;
use Exception;

class JWTFromCookie
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if ($request->hasCookie('token')) {
            try {
                $token = $request->cookie('token');
                Log::info('Token dari cookie: ' . $token);
                $payload = JWTAuth::setToken($token)->getPayload(); // This will set the token in JWTAuth
                if (!JWTAuth::check()) {
                    return response()->json([
                        'code'      => 401,
                        'errors'    => 'Token tidak valid'
                    ], 401);
                }
                $request->attributes->set('user', $payload);
            } catch (Exception $e) {
                return response()->json([
                    'code'    => 401,
                    'errors'  => 'Token tidak tersedia atau invalid'
                ], 401);
            }
        } else {
            Log::info('Token tidak disediakan');
            return response()->json([
                'code'      => 401,
                'error'     => 'Token tidak disediakan'
            ], 401);
        }

        return $next($request);
    }
}
