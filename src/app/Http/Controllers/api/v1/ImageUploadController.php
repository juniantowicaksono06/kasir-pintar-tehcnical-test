<?php

namespace App\Http\Controllers\api\v1;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;


class ImageUploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|mimes:jpg,png|max:10240', // 10MB max
        ]);

        $image = $request->file('image');
        $expFilename = explode('.', $image->getClientOriginalName());
        $extension = $expFilename[count($expFilename) - 1];
        $imagePath = public_path('images');
        $imageName = time() . "." . $extension;
        if(!is_dir($imagePath)) {
            mkdir($imagePath, 0755, true);
        }
        $driver = new Driver();
        $manager = new ImageManager($driver);
        $img = $manager->read($image->getRealPath());
        $img->save($imagePath . '/' . $imageName);


        return response()->json([
            'code'      => 200,
            'message'   => 'Image uploaded successfully', 
            'data'      => [
                'image' => $imageName
            ]
        ], 200);
    }
}
