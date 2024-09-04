> Tested with node version v16.14.0 and v18.12.1

#### Instructions

To Run:
1. `yarn install`
2. `npm run build`
3. `npx webpack serve`
4. go to https://localhost:8080
5. create a circle ROI on each viewport

#### Issue

Expected behaviour: One viewport is displaying image 0, the other is displaying image 10, so each annotation should be created on one viewport and not the other

Actual behaviour: Annotations created on image `dicom:0` only display on the viewport displaying image `dicom:0`, however annotations created on image `dicom:10` display on both the viewport displaying image `dicom:10` and the viewport displaying image `dicom:0`.

#### Credits

Images used are from the Cancer Imaging Archive: https://www.cancerimagingarchive.net/collection/lung-fused-ct-pathology/