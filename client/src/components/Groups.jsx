import React from "react";

function Groups() {
    return (
        <div className="flex flex-col items-center bg-gray-100 justify-center min-h-full p-6">
            <h1 className="text-2xl font-bold mb-4">Groups</h1>
            <div className="mt-6 w-full max-w-2xl">
                <div className="text-center text-sm text-gray-400">
                    You are not part of any groups yet.
                </div>
            </div>
        </div>
    );
}

export default Groups;
