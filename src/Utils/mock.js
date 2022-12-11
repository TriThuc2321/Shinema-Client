export const FakeApi = () =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 800);
    });
