// The tilt sensor is what makes a real scoliometer reading possible. Phones and
// tablets have it; laptops generally don't. iOS additionally requires an
// explicit permission request triggered by a user tap.

type OrientationEventWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

export function hasMotionSensor(): boolean {
  return typeof DeviceOrientationEvent !== 'undefined';
}

// iOS 13+ gates orientation data behind a permission prompt that can only be
// triggered from a user gesture. Other platforms grant it automatically.
export function needsMotionPermission(): boolean {
  const D = DeviceOrientationEvent as OrientationEventWithPermission;
  return typeof D?.requestPermission === 'function';
}

export async function requestMotionPermission(): Promise<boolean> {
  const D = DeviceOrientationEvent as OrientationEventWithPermission;
  if (typeof D?.requestPermission !== 'function') return hasMotionSensor();
  try {
    const result = await D.requestPermission();
    return result === 'granted';
  } catch {
    return false;
  }
}

export async function requestCameraPermission(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    // We only wanted the permission — release the camera immediately
    stream.getTracks().forEach((t) => t.stop());
    return true;
  } catch {
    return false;
  }
}