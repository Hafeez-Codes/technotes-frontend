import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';

const notesAdapter = createEntityAdapter({
	// sortComparer: (a, b) =>
	// 	a.completed === b.completed ? 0 : a.completed ? 1 : -1,
	sortComparer: (a, b) => a.completed - b.completed,
});

const initialState = notesAdapter.getInitialState();

export const notesApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getNotes: builder.query({
			query: () => ({
				url: '/notes',
				validateStatus: (response, result) => {
					return response.status === 200 && !result.isError;
				},
			}),
			transformResponse: (responseData) => {
				const loadedNotes = responseData.map((note) => {
					note.id = note._id;
					return note;
				});

				// const loadedNotes = responseData
				// 	.map((note) => {
				// 		if (!note._id) {
				// 			console.error('Missing _id for note:', note);
				// 			return null; // Skip invalid notes
				// 		}
				// 		return { ...note, id: note._id };
				// 	})
				// 	.filter((note) => note !== null); // Remove null values

				// const loadedNotes = Array.isArray(responseData)
				// 	? responseData.map((note) => ({
				// 			...note,
				// 			id: note._id,
				// 	    }))
				// 	: Object.values(responseData)
				// 			.filter((item) => item._id) // Remove non-note objects
				// 			.map((note) => ({ ...note, id: note._id }));

				return notesAdapter.setAll(initialState, loadedNotes);
			},
			providesTags: (result, error, arg) => {
				if (result?.ids) {
					return [
						{ type: 'Note', id: 'LIST' },
						...result.ids.map((id) => ({ type: 'Note', id })),
					];
				} else return [{ type: 'Note', id: 'LIST' }];
			},
		}),
		addNewNote: builder.mutation({
			query: (initialNote) => ({
				url: '/notes',
				method: 'POST',
				body: {
					...initialNote,
				},
			}),
			invalidatesTags: [{ type: 'Note', id: 'LIST' }],
		}),
		updateNote: builder.mutation({
			query: (initialNote) => ({
				url: '/notes',
				method: 'PATCH',
				body: {
					...initialNote,
				},
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: 'Note', id: arg.id },
			],
		}),
		deleteNote: builder.mutation({
			query: ({ id }) => ({
				url: `/notes`,
				method: 'DELETE',
				body: { id },
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: 'Note', id: arg.id },
			],
		}),
	}),
});

export const {
	useGetNotesQuery,
	useAddNewNoteMutation,
	useUpdateNoteMutation,
	useDeleteNoteMutation,
} = notesApiSlice;

// returns the query result object
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select();

// creates memoized selector
const selectNotesData = createSelector(
	selectNotesResult,
	(notesResult) => notesResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
	selectAll: selectAllNotes,
	selectById: selectNoteById,
	selectIds: selectNoteIds,
	// Pass in a selector that returns the notes slice of state
} = notesAdapter.getSelectors(
	(state) => selectNotesData(state) ?? initialState
);
