class HighScoresController < ApplicationController
  def index
    @high_scores = HighScore.all
  end

  def create
    HighScore.create!(name: params['name'], score: params['score'])
    redirect_to high_scores_path
  end
end
