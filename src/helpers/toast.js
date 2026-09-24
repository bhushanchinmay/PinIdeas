export async function toast(message, duration = 4000) {
    const toast = document.createElement("ion-toast");
    toast.message = message;
    toast.duration = duration
    toast.color = "dark";
    toast.addEventListener("ionToastDidDismiss", () => toast.remove());

    document.body.appendChild(toast);
    // The toast must finish rendering before present() can animate it.
    // (Same approach as Ionic's own overlay controllers.)
    await customElements.whenDefined("ion-toast");
    if (toast.componentOnReady) {
      await toast.componentOnReady();
    } else {
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    return toast.present();
}
