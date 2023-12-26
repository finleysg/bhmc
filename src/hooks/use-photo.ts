import { useMutation, useQuery } from "@tanstack/react-query"

import { Photo, PhotoApiSchema } from "../models/photo"
import { getOne, httpClient } from "../utils/api-client"
import { apiUrl } from "../utils/api-utils"

export function usePhoto(photoId: number) {
  const endpoint = `photos/${photoId}/`
  return useQuery({
    queryKey: [endpoint],
    queryFn: () => getOne(endpoint, PhotoApiSchema),
    select: (data) => {
      if (data) {
        return new Photo(data)
      }
    },
  })
}

export function useUploadPhoto() {
  return useMutation({
    mutationFn: (formData: FormData) => httpClient(apiUrl(`photos/`), { body: formData }),
  })
}
