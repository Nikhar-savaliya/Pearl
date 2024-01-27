const LoadMoreDataButton = ({ state, fetchDataFunction }) => {
  if (state != null && state.totalDocs > state.results.length) {
    return (
      <button
        onClick={() => fetchDataFunction({ page: state.page + 1 })}
        className="text-zinc-400 p-2 px-3 hover:bg-zinc-200/70 rounded-lg flex items-center gap-2"
      >
        Load More
      </button>
    );
  }
};

export default LoadMoreDataButton;
