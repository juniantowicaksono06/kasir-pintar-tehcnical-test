<?php
namespace App\Http\Controllers\api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class VerifyController extends Controller {
    public function get(Request $request) {
        return response()->json([
            'code'      => 200,
            'data'      => [
                'user'  => $request->attributes->get('user')
            ]
        ], 200);
    }
}