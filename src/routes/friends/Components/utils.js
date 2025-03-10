export const close_current_mutuals = (setViewAllUserMutuals, current_prof_id) => {
    setViewAllUserMutuals((prev) => {
        return prev.filter((p) => {
            return p.prof_id !== current_prof_id
        })
    })
}